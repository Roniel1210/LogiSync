$baseUrl = if ($env:VITE_N8N_BASE_URL) { $env:VITE_N8N_BASE_URL.TrimEnd('/') } else { 'http://localhost:5678' }
$healthUrl = "$baseUrl/healthz"
$containerName = 'logisync-n8n'

Write-Host "Checking n8n health at $healthUrl"

try {
  $response = Invoke-WebRequest -UseBasicParsing -Uri $healthUrl -TimeoutSec 15
  Write-Host "HTTP $($response.StatusCode)"
  Write-Output $response.Content
} catch {
  Write-Warning "Host check failed: $($_.Exception.Message)"
  Write-Host "Trying container fallback: $containerName"

  $containerResponse = docker exec $containerName /bin/sh -c "wget -q -O - http://127.0.0.1:5678/healthz"

  if ($LASTEXITCODE -eq 0 -and $containerResponse) {
    Write-Host 'Container fallback succeeded'
    Write-Output $containerResponse
    exit 0
  }

  Write-Error "n8n health check failed from host and container fallback"
  exit 1
}
