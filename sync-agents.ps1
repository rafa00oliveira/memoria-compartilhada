# sync-agents.ps1 — sincroniza a copia de AGENTS.md na raiz com a fonte de verdade.
# Fonte: memoria-compartilhada\AGENTS.md  ->  copia: <raiz>\AGENTS.md
# Uso:  powershell -ExecutionPolicy Bypass -File .\sync-agents.ps1          (sincroniza)
#       powershell -ExecutionPolicy Bypass -File .\sync-agents.ps1 -Check   (so reporta divergencia)
param([switch]$Check)
$ErrorActionPreference = 'Stop'
$src = Join-Path $PSScriptRoot 'AGENTS.md'
$dst = Join-Path (Split-Path $PSScriptRoot -Parent) 'AGENTS.md'

$srcText = Get-Content -Raw $src
$dstText = if (Test-Path $dst) { Get-Content -Raw $dst } else { $null }

if ($srcText -eq $dstText) {
    Write-Host "Ja sincronizado: $dst"
    exit 0
}

if ($Check) {
    Write-Warning "DIVERGENTE: a copia da raiz difere da fonte. Rode sem -Check para sobrescrever."
    Write-Warning "  fonte: $src"
    Write-Warning "  copia: $dst"
    exit 1
}

Write-Warning "A copia da raiz sera SOBRESCRITA pela fonte (qualquer edicao manual nela sera perdida):"
Write-Warning "  fonte: $src"
Write-Warning "  copia: $dst"
Copy-Item $src $dst -Force
Write-Host "Atualizado: $dst"
