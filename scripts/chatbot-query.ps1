param(
  [string]$Question = ""
)

$scriptPath = Join-Path $PSScriptRoot "chatbot-query.cjs"
node $scriptPath --question $Question
