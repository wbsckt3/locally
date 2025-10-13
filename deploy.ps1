# Script de Deploy Automático para GitHub Pages
# Ejecutar con: .\deploy.ps1
# Este script usa las credenciales configuradas específicamente para este proyecto

Write-Host "🚀 Iniciando deploy automático..." -ForegroundColor Green

# Verificar configuración de Git
Write-Host "🔍 Verificando configuración de Git..." -ForegroundColor Yellow
$gitUser = git config user.name
$gitEmail = git config user.email
Write-Host "   Usuario: $gitUser" -ForegroundColor Cyan
Write-Host "   Email: $gitEmail" -ForegroundColor Cyan

try {
    # 1. Hacer build
    Write-Host "📦 Ejecutando npm run build..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        throw "Error en el build"
    }
    
    # 2. Verificar que el build se completó
    if (-not (Test-Path "dist")) {
        throw "❌ El directorio dist no existe después del build"
    }
    
    # 3. Agregar archivos al staging
    Write-Host "📁 Agregando archivos al staging..." -ForegroundColor Yellow
    git add dist/
    
    # 4. Hacer commit
    $timestamp = Get-Date -Format "yyyy-MM-dd-HH-mm-ss"
    $commitMessage = "🚀 Deploy automático - $timestamp"
    Write-Host "💾 Haciendo commit: $commitMessage" -ForegroundColor Yellow
    git commit -m $commitMessage
    
    # 5. Push al repositorio remoto
    Write-Host "🌐 Haciendo push al repositorio remoto..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host "✅ Deploy completado exitosamente!" -ForegroundColor Green
    Write-Host "🌍 Tu aplicación debería estar disponible en GitHub Pages" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error durante el deploy: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
