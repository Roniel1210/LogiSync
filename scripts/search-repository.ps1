param(
  [string]$Query = ""
)

$path = "C:\Users\PC6 - 2\LogiSync\data\repository\index.json"
$raw = Get-Content -Raw $path
$data = $raw | ConvertFrom-Json

if ([string]::IsNullOrWhiteSpace($Query)) {
  $data | ConvertTo-Json -Depth 10
  exit 0
}

$q = $Query.ToLowerInvariant()
$filtered = @(
  $data.documents | Where-Object {
    $_.title.ToLowerInvariant().Contains($q) -or
    $_.type.ToLowerInvariant().Contains($q) -or
    ($_.path -and $_.path.ToLowerInvariant().Contains($q))
  }
)

[pscustomobject]@{
  documents = $filtered
} | ConvertTo-Json -Depth 10
