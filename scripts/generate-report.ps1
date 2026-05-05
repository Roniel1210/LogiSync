param(
  [string]$Type = "Operaciones"
)

$summaryPath = "C:\Users\PC6 - 2\LogiSync\data\reports\summary.json"
$generatedDir = "C:\Users\PC6 - 2\LogiSync\data\reports\generated"

if (-not (Test-Path $generatedDir)) {
  New-Item -ItemType Directory -Path $generatedDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$safeType = ($Type -replace '[^a-zA-Z0-9_-]', '-').ToLowerInvariant()
$fileName = "reporte-$safeType-$timestamp.csv"
$filePath = Join-Path $generatedDir $fileName

$csv = @(
  "indicador,valor"
  "sincronizacion_inventario,98.4"
  "sla_entregas,96.5"
  "optimizacion_compras,42500"
  "nodos_activos,1248"
) -join "`r`n"

Set-Content -LiteralPath $filePath -Value $csv -Encoding UTF8

$summary = Get-Content -Raw $summaryPath | ConvertFrom-Json
$nextId = 1
if ($summary.reports.Count -gt 0) {
  $nextId = (($summary.reports | Measure-Object -Property id -Maximum).Maximum + 1)
}

$newReport = [pscustomobject]@{
  id = $nextId
  title = "Reporte $Type $timestamp"
  type = $Type
  date = (Get-Date -Format "dd/MM/yyyy HH:mm")
  format = "CSV"
  size = "{0:N1} KB" -f ((Get-Item $filePath).Length / 1KB)
  path = $filePath.Replace('\', '/')
}

$summary.reports = @($newReport) + @($summary.reports)
$summary | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $summaryPath -Encoding UTF8

[pscustomobject]@{
  ok = $true
  fileName = $fileName
  path = $filePath.Replace('\', '/')
} | ConvertTo-Json -Depth 10
