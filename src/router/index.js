
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// Import views
import Login from '../views/Login.vue'
import CompanyProfile from '../views/CompanyProfile.vue'
import TechnicianProfile from '../views/TechnicianProfile.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/company',
    name: 'company',
    component: CompanyProfile,
    meta: { 
      requiresAuth: true, 
      profile: 'company' 
    }
  },
  {
    path: '/technician',
    name: 'technician',
    component: TechnicianProfile,
    meta: { 
      requiresAuth: true, 
      profile: 'technician' 
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  const userProfile = store.getters.userProfile
  const requiresAuth = to.meta.requiresAuth
  const requiredProfile = to.meta.profile

  console.log('🔍 Router guard:', {
    to: to.name,
    isAuthenticated,
    userProfile,
    requiresAuth,
    requiredProfile
  })

  // If route requires authentication
  if (requiresAuth) {
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login')
      next({ name: 'login' })
      return
    }

    // If route requires specific profile
    if (requiredProfile && userProfile !== requiredProfile) {
      console.log(`❌ Wrong profile. Required: ${requiredProfile}, Current: ${userProfile}`)
      // Redirect to correct profile
      if (userProfile === 'company') {
        next({ name: 'company' })
      } else if (userProfile === 'technician') {
        next({ name: 'technician' })
      } else {
        next({ name: 'login' })
      }
      return
    }
  }

  // If user is authenticated and trying to access login
  if (to.name === 'login' && isAuthenticated) {
    console.log('🔄 Already authenticated, redirecting to profile')
    if (userProfile === 'company') {
      next({ name: 'company' })
    } else if (userProfile === 'technician') {
      next({ name: 'technician' })
    } else {
      next({ name: 'login' })
    }
    return
  }

  next()
})

export default router