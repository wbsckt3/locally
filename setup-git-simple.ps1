# Script simple para configurar Git
Write-Host "Configurando Git para este proyecto..." -ForegroundColor Green

# Configurar usuario y email
$gitUser = "wbsckt3"
$gitEmail = "wbsckt3@gmail.com"

Write-Host "Configurando usuario Git local..." -ForegroundColor Yellow
git config user.name $gitUser
git config user.email $gitEmail

# Mostrar configuracion actual
Write-Host "Configuracion actual:" -ForegroundColor Green
Write-Host "   Usuario: $(git config user.name)" -ForegroundColor Cyan
Write-Host "   Email: $(git config user.email)" -ForegroundColor Cyan

# Configurar repositorio remoto
$repoUrl = "https://github.com/wbsckt3/locally.git"

Write-Host "Configurando repositorio remoto..." -ForegroundColor Yellow
git remote add origin $repoUrl

# Configurar rama principal
Write-Host "Configurando rama principal..." -ForegroundColor Yellow
git branch -M main

Write-Host "Configuracion completada!" -ForegroundColor Green
Write-Host "Ahora puedes usar: npm run deploy" -ForegroundColor Cyan
