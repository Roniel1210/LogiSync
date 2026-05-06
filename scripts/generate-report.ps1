param(
  [string]$Type = "Operaciones"
)

$scriptPath = Join-Path $PSScriptRoot "generate-report.cjs"
node $scriptPath --type $Type
