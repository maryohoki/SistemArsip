try {
    $r = Invoke-RestMethod -Uri 'http://localhost:3001/api/health'
    Write-Host "HEALTH OK:" ($r | ConvertTo-Json)
    
    $arsip = Invoke-RestMethod -Uri 'http://localhost:3001/api/arsip'
    Write-Host "ARSIP COUNT: $($arsip.pagination.totalItems) records"
    
    $settings = Invoke-RestMethod -Uri 'http://localhost:3001/api/settings'
    Write-Host "SETTINGS: desa=$($settings.data.desa)"
    
    Write-Host ""
    Write-Host "=== SEMUA ENDPOINT BEKERJA! BACKEND SIAP! ==="
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
