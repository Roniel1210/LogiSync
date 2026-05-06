Write-Host "Dashboard"
& (Join-Path $PSScriptRoot "get-dashboard-summary.ps1")
Write-Host ""
Write-Host "Predictive"
& (Join-Path $PSScriptRoot "get-predictive-summary.ps1")
Write-Host ""
Write-Host "Reports"
& (Join-Path $PSScriptRoot "get-reports-summary.ps1")
Write-Host ""
Write-Host "Repository Search"
& (Join-Path $PSScriptRoot "search-repository.ps1") -Query "contrato"
Write-Host ""
Write-Host "Chatbot"
& (Join-Path $PSScriptRoot "chatbot-query.ps1") -Question "Explicame la semana 3"
