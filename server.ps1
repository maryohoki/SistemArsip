$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:${port}/")

try {
    $listener.Start()
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "  Localhost Server Berhasil Dijalankan!           " -ForegroundColor Green
    Write-Host "  Akses Web di: http://localhost:${port}/         " -ForegroundColor Cyan
    Write-Host "  Tekan Ctrl+C di terminal ini untuk stop.        " -ForegroundColor Yellow
    Write-Host "==================================================" -ForegroundColor Green
} catch {
    Write-Host "Gagal memulai server pada port ${port}." -ForegroundColor Red
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath)
        if ($urlPath -eq "/") { $urlPath = "/index.html" }
        
        $filePath = Join-Path (Get-Location) $urlPath.TrimStart('/')
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            
            if ($mimeTypes.ContainsKey($ext)) {
                $response.ContentType = $mimeTypes[$ext]
            } else {
                $response.ContentType = "application/octet-stream"
            }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.Close()
    } catch {
        # Ignore transient connection errors
    }
}
