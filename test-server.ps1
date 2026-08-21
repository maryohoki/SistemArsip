try {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:8080/")
    $listener.Start()
    Write-Host "OK - HttpListener berhasil dijalankan" -ForegroundColor Green
    $listener.Stop()
} catch {
    Write-Host ("ERROR: " + $_.Exception.Message) -ForegroundColor Red
}
