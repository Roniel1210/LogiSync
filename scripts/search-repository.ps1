param(
  [string]$Query = ""
)

$scriptPath = Join-Path $PSScriptRoot "search-repository.cjs"
node $scriptPath --query $Query
