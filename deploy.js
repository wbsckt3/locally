#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando deploy automático...');

try {
  // 1. Hacer build
  console.log('📦 Ejecutando npm run build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 2. Verificar que el build se completó
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('❌ El directorio dist no existe después del build');
  }
  
  // 3. Agregar archivos al staging
  console.log('📁 Agregando archivos al staging...');
  execSync('git add dist/', { stdio: 'inherit' });
  
  // 4. Hacer commit
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const commitMessage = `🚀 Deploy automático - ${timestamp}`;
  console.log(`💾 Haciendo commit: ${commitMessage}`);
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  
  // 5. Push al repositorio remoto
  console.log('🌐 Haciendo push al repositorio remoto...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('✅ Deploy completado exitosamente!');
  console.log('🌍 Tu aplicación debería estar disponible en GitHub Pages');
  
} catch (error) {
  console.error('❌ Error durante el deploy:', error.message);
  process.exit(1);
}
