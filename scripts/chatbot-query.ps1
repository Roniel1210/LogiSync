param(
  [string]$Question = ""
)

$knowledgePath = "C:\Users\PC6 - 2\LogiSync\data\chatbot\knowledge.json"
$knowledge = (Get-Content -Raw $knowledgePath | ConvertFrom-Json)
$lower = $Question.ToLowerInvariant()

$answer = "No encontre suficiente contexto local para responder con precision."

if ($lower.Contains("semana 3") -or $lower.Contains("stock")) {
  $answer = "La Semana 3 muestra demanda de 4,800 unidades frente a 2,000 de inventario. La ruptura estimada es de 2,800 unidades."
} elseif ($lower.Contains("proveedor") -or $lower.Contains("semiconductores")) {
  $answer = "GlobalTech Solutions aparece como la opcion con mayor confianza para Semiconductores A con 98%."
} elseif ($lower.Contains("flujo") -or $lower.Contains("operativo")) {
  $answer = "El flujo operativo mantiene 98.4% de sincronizacion de inventario y 96.5% de SLA de entregas."
} elseif ($knowledge.context.Count -gt 0) {
  $answer = ($knowledge.context -join " ")
}

[pscustomobject]@{
  answer = $answer
} | ConvertTo-Json -Depth 10
