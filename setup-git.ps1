# Script de Configuración Inicial de Git
# Ejecutar una sola vez para configurar el repositorio

Write-Host "🔧 Configurando repositorio Git..." -ForegroundColor Green

# Preguntar por la URL del repositorio
$repoUrl = Read-Host "https://github.com/wbsckt3/locally.git"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ URL del repositorio requerida" -ForegroundColor Red
    exit 1
}

try {
    # Configurar repositorio remoto
    Write-Host "🌐 Configurando repositorio remoto..." -ForegroundColor Yellow
    git remote add origin $repoUrl
    
    # Configurar rama principal
    Write-Host "🌿 Configurando rama principal..." -ForegroundColor Yellow
    git branch -M main
    
    # Hacer commit inicial
    Write-Host "📝 Haciendo commit inicial..." -ForegroundColor Yellow
    git add .
    git commit -m "🎉 Commit inicial - Configuración del proyecto"
    
    # Push inicial
    Write-Host "🚀 Haciendo push inicial..." -ForegroundColor Yellow
    git push -u origin main
    
    Write-Host "✅ Configuración completada!" -ForegroundColor Green
    Write-Host "🎯 Ahora puedes usar: npm run deploy" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error en la configuración: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
