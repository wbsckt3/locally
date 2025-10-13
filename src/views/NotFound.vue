<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-icon">
        <i class="ph ph-warning-circle"></i>
      </div>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe o ha sido movida.</p>
      <button @click="goHome" class="btn primary">
        <i class="ph ph-house"></i>
        Ir al Inicio
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFound',
  setup() {
    const router = useRouter()
    
    const goHome = () => {
      router.push({ name: 'login' })
    }
    
    return {
      goHome
    }
  }
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.not-found-content {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 60px 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  max-width: 500px;
  width: 100%;
}

.not-found-icon {
  margin-bottom: 24px;
}

.not-found-icon i {
  font-size: 64px;
  color: #f6ad55;
}

.not-found-content h1 {
  font-size: 72px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 16px 0;
  line-height: 1;
}

.not-found-content h2 {
  font-size: 32px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 16px 0;
}

.not-found-content p {
  font-size: 18px;
  color: #718096;
  margin: 0 0 32px 0;
  line-height: 1.5;
}

.btn {
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.btn.primary {
  background: #667eea;
  color: white;
}

.btn.primary:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

@media (max-width: 640px) {
  .not-found-content {
    padding: 40px 24px;
  }
  
  .not-found-content h1 {
    font-size: 48px;
  }
  
  .not-found-content h2 {
    font-size: 24px;
  }
  
  .not-found-content p {
    font-size: 16px;
  }
}
</style>



