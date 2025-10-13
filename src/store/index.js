// npm install vuex@next --save

import { createStore } from 'vuex'

export default createStore({
  state: {
    // Authentication state
    auth: {
      loggedIn: false,
      user: null,
      profile: null, // 'company' or 'technician'
      token: null,
      tokenExpiry: null
    },
    // Application state
    app: {
      loading: false,
      notifications: []
    },
    // Map state
    map: {
      userLocation: null,
      damages: [],
      markers: []
    },
    // Company state
    company: {
      currentCompany: null,
      companyInfo: null
    }
  },
  mutations: {
    // Auth mutations
    SET_USER(state, user) {
      state.auth.loggedIn = true;
      state.auth.user = user;
    },
    SET_PROFILE(state, profile) {
      state.auth.profile = profile;
    },
    SET_TOKEN(state, { token, expiry }) {
      state.auth.token = token;
      state.auth.tokenExpiry = expiry;
    },
    LOGOUT(state) {
      state.auth.loggedIn = false;
      state.auth.user = null;
      state.auth.profile = null;
      state.auth.token = null;
      state.auth.tokenExpiry = null;
    },
    // App mutations
    SET_LOADING(state, loading) {
      state.app.loading = loading;
    },
    ADD_NOTIFICATION(state, notification) {
      state.app.notifications.push(notification);
    },
    REMOVE_NOTIFICATION(state, id) {
      const index = state.app.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        state.app.notifications.splice(index, 1);
      }
    },
    // Map mutations
    SET_USER_LOCATION(state, location) {
      state.map.userLocation = location;
    },
    SET_DAMAGES(state, damages) {
      state.map.damages = damages;
    },
    // Company mutations
    SET_CURRENT_COMPANY(state, company) {
      state.company.currentCompany = company;
    },
    SET_COMPANY_INFO(state, info) {
      state.company.companyInfo = info;
    }
  },
  actions: {
    // Auth actions
    async login({ commit }, { userData, profile }) {
      try {
        const tokenExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        
        // Save to localStorage
        localStorage.setItem('refactorii_token', userData.credential || 'demo-token');
        localStorage.setItem('token_expiry', tokenExpiry.toString());
        localStorage.setItem('user_data', JSON.stringify(userData));
        localStorage.setItem('user_profile', profile);
        
        // Commit to store
        commit('SET_USER', userData);
        commit('SET_PROFILE', profile);
        commit('SET_TOKEN', { 
          token: userData.credential || 'demo-token', 
          expiry: tokenExpiry 
        });
        
        return { success: true };
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }
    },
    
    async logout({ commit }) {
      // Clear localStorage
      localStorage.removeItem('refactorii_token');
      localStorage.removeItem('token_expiry');
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_profile');
      
      // Clear store
      commit('LOGOUT');
    },
    
    async checkAuthStatus({ commit }) {
      const token = localStorage.getItem('refactorii_token');
      const userData = localStorage.getItem('user_data');
      const tokenExpiry = localStorage.getItem('token_expiry');
      const savedProfile = localStorage.getItem('user_profile');
      
      // Check if token has expired
      if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
        console.log('Token expired, clearing data');
        await this.dispatch('logout');
        return false;
      }
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          commit('SET_USER', user);
          commit('SET_PROFILE', savedProfile);
          commit('SET_TOKEN', { token, expiry: parseInt(tokenExpiry) });
          return true;
        } catch (error) {
          console.error('Error parsing user data:', error);
          await this.dispatch('logout');
          return false;
        }
      }
      
      return false;
    },
    
    // App actions
    showNotification({ commit }, { message, type = 'info', duration = 5000 }) {
      const id = Date.now();
      const notification = {
        id,
        message,
        type,
        duration
      };
      
      commit('ADD_NOTIFICATION', notification);
      
      // Auto remove after duration
      setTimeout(() => {
        commit('REMOVE_NOTIFICATION', id);
      }, duration);
    },
    
    // Map actions
    async loadUserLocation({ commit }) {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy
            };
            commit('SET_USER_LOCATION', location);
            resolve(location);
          },
          (error) => {
            console.warn('Geolocation error:', error);
            // Use default location (Medellín)
            const defaultLocation = { lat: 6.2442, lng: -75.5812 };
            commit('SET_USER_LOCATION', defaultLocation);
            resolve(defaultLocation);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
      });
    },
    
    async loadDamages({ commit, state }) {
      try {
        console.log('🔍 Loading damages from API...');
        const API_BASE_URL = 'https://www.refactorii.com/api/tenant';
        const location = state.map.userLocation || { lat: 6.2442, lng: -75.5812 };
        
        const url = `${API_BASE_URL}/damages/nearby?latitude=${location.lat}&longitude=${location.lng}&radius=20000`;
        console.log('🔗 API URL:', url);
        console.log('👤 User email:', state.auth.user?.Email);
        
        const response = await fetch(url, {
          headers: {
            'x-user-email': state.auth.user?.Email || ''
          }
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API Error:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('📋 API Response:', data);
        console.log('📋 Data array:', data.data);
        console.log('📋 Data length:', data.data?.length || 0);
        
        commit('SET_DAMAGES', data.data || []);
        return data.data || [];
      } catch (error) {
        console.error('Error loading damages:', error);
        commit('SET_DAMAGES', []);
        return [];
      }
    }
  },
  getters: {
    isAuthenticated: (state) => state.auth.loggedIn,
    currentUser: (state) => state.auth.user,
    userProfile: (state) => state.auth.profile,
    isCompany: (state) => state.auth.profile === 'company',
    isTechnician: (state) => state.auth.profile === 'technician',
    userEmail: (state) => state.auth.user?.Email || '',
    userLocation: (state) => state.map.userLocation,
    damages: (state) => state.map.damages,
    currentCompany: (state) => state.company.currentCompany
  }
})
