# sync-agents.ps1 — sincroniza a copia de AGENTS.md na raiz com a fonte de verdade.
# Fonte: memoria-compartilhada\AGENTS.md  ->  copia: <raiz>\AGENTS.md
# Uso:  powershell -ExecutionPolicy Bypass -File .\sync-agents.ps1
$ErrorActionPreference = 'Stop'
$src = Join-Path $PSScriptRoot 'AGENTS.md'
$dst = Join-Path (Split-Path $PSScriptRoot -Parent) 'AGENTS.md'

$srcText = Get-Content -Raw $src
$dstText = if (Test-Path $dst) { Get-Content -Raw $dst } else { $null }

if ($srcText -eq $dstText) {
    Write-Host "Ja sincronizado: $dst"
} else {
    Copy-Item $src $dst -Force
    Write-Host "Atualizado: $dst"
}
