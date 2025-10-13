# Script para configurar credenciales de GitHub de forma segura
# Este script te ayuda a configurar autenticación sin exponer tokens

Write-Host "🔐 Configurando credenciales de GitHub..." -ForegroundColor Green

Write-Host "📋 Opciones de autenticación:" -ForegroundColor Yellow
Write-Host "   1. GitHub CLI (más fácil y seguro)" -ForegroundColor Cyan
Write-Host "   2. Token de acceso personal" -ForegroundColor Cyan
Write-Host "   3. SSH Key" -ForegroundColor Cyan

$choice = Read-Host "Selecciona una opción (1/2/3)"

switch ($choice) {
    "1" {
        Write-Host "🔧 Configurando GitHub CLI..." -ForegroundColor Yellow
        
        # Verificar si GitHub CLI está instalado
        try {
            gh --version | Out-Null
            Write-Host "✅ GitHub CLI ya está instalado" -ForegroundColor Green
        } catch {
            Write-Host "❌ GitHub CLI no está instalado" -ForegroundColor Red
            Write-Host "📥 Descarga desde: https://cli.github.com/" -ForegroundColor Yellow
            Write-Host "   O ejecuta: winget install GitHub.cli" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "🔑 Ejecutando autenticación..." -ForegroundColor Yellow
        Write-Host "   Se abrirá una ventana del navegador para autenticarte" -ForegroundColor Cyan
        
        # Ejecutar autenticación
        gh auth login --web
        
        Write-Host "✅ Autenticación completada" -ForegroundColor Green
    }
    
    "2" {
        Write-Host "🔑 Configurando Token de Acceso Personal..." -ForegroundColor Yellow
        Write-Host "📋 Pasos para crear un token:" -ForegroundColor Cyan
        Write-Host "   1. Ve a GitHub.com → Settings → Developer settings" -ForegroundColor White
        Write-Host "   2. Personal access tokens → Tokens (classic)" -ForegroundColor White
        Write-Host "   3. Generate new token → Generate new token (classic)" -ForegroundColor White
        Write-Host "   4. Selecciona scopes: repo, workflow" -ForegroundColor White
        Write-Host "   5. Copia el token generado" -ForegroundColor White
        
        $token = Read-Host "Ingresa tu token de acceso personal"
        
        if (-not [string]::IsNullOrWhiteSpace($token)) {
            # Configurar credenciales
            git config credential.helper store
            
            # Crear archivo de credenciales
            $credentialsFile = Join-Path $PWD ".git\credentials"
            $credentialLine = "https://$($token)@github.com"
            
            Add-Content -Path $credentialsFile -Value $credentialLine
            Write-Host "✅ Token configurado de forma segura" -ForegroundColor Green
        }
    }
    
    "3" {
        Write-Host "🔑 Configurando SSH Key..." -ForegroundColor Yellow
        Write-Host "📋 Pasos para configurar SSH:" -ForegroundColor Cyan
        Write-Host "   1. Genera una nueva SSH key: ssh-keygen -t ed25519 -C 'tu-email@ejemplo.com'" -ForegroundColor White
        Write-Host "   2. Agrega la key a tu cuenta GitHub" -ForegroundColor White
        Write-Host "   3. Configura el repositorio para usar SSH" -ForegroundColor White
        
        $useSSH = Read-Host "¿Quieres configurar SSH ahora? (y/n)"
        if ($useSSH -eq "y" -or $useSSH -eq "Y") {
            # Cambiar URL del repositorio a SSH
            $sshUrl = Read-Host "Ingresa la URL SSH del repositorio (ej: git@github.com:usuario/locally.git)"
            if (-not [string]::IsNullOrWhiteSpace($sshUrl)) {
                git remote set-url origin $sshUrl
                Write-Host "✅ URL SSH configurada" -ForegroundColor Green
            }
        }
    }
    
    default {
        Write-Host "❌ Opción no válida" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Configuración de credenciales completada!" -ForegroundColor Green
Write-Host "🎯 Ahora puedes usar: npm run deploy" -ForegroundColor Cyan
