# Script para configurar Git específico para este proyecto
# Configura credenciales separadas de la cuenta corporativa

Write-Host "🔧 Configurando Git específico para este proyecto..." -ForegroundColor Green

# Configurar usuario y email específicos para este proyecto
$gitUser = "wbsckt3"
$gitEmail = "wbsckt3@gmail.com"

if ([string]::IsNullOrWhiteSpace($gitUser) -or [string]::IsNullOrWhiteSpace($gitEmail)) {
    Write-Host "❌ Usuario y email son requeridos" -ForegroundColor Red
    exit 1
}

try {
    # Configurar usuario y email solo para este repositorio
    Write-Host "👤 Configurando usuario Git local..." -ForegroundColor Yellow
    git config user.name $gitUser
    git config user.email $gitEmail
    
    # Mostrar configuración actual
    Write-Host "✅ Configuración actual:" -ForegroundColor Green
    Write-Host "   Usuario: $(git config user.name)" -ForegroundColor Cyan
    Write-Host "   Email: $(git config user.email)" -ForegroundColor Cyan
    
    # Configurar repositorio remoto
    $repoUrl = "https://github.com/wbsckt3/locally.git"
    
    if ([string]::IsNullOrWhiteSpace($repoUrl)) {
        Write-Host "❌ URL del repositorio requerida" -ForegroundColor Red
        exit 1
    }
    
    # Agregar repositorio remoto
    Write-Host "🌐 Configurando repositorio remoto..." -ForegroundColor Yellow
    git remote add origin $repoUrl
    
    # Configurar rama principal
    Write-Host "🌿 Configurando rama principal..." -ForegroundColor Yellow
    git branch -M main
    
    # Configurar credenciales (opcional - para evitar prompts)
    Write-Host "🔐 Configuración de credenciales:" -ForegroundColor Yellow
    Write-Host "   Opción 1: Usar GitHub CLI (recomendado)" -ForegroundColor Cyan
    Write-Host "   Opción 2: Usar token de acceso personal" -ForegroundColor Cyan
    Write-Host "   Opción 3: Configurar manualmente cuando sea necesario" -ForegroundColor Cyan
    
    $credentialChoice = Read-Host "Selecciona opción (1/2/3)"
    
    if ($credentialChoice -eq "1") {
        Write-Host "📋 Para usar GitHub CLI, ejecuta: gh auth login" -ForegroundColor Yellow
    } elseif ($credentialChoice -eq "2") {
        $token = Read-Host "Ingresa tu token de acceso personal de GitHub"
        if (-not [string]::IsNullOrWhiteSpace($token)) {
            git config credential.helper store
            Write-Host "Token configurado (se guardará en .git/credentials)" -ForegroundColor Green
        }
    }
    
    Write-Host "✅ Configuración completada!" -ForegroundColor Green
    Write-Host "🎯 Ahora puedes usar: npm run deploy" -ForegroundColor Cyan
    Write-Host "📝 Nota: Esta configuración es solo para este proyecto" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Error en la configuración: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
