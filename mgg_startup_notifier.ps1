Add-Type -AssemblyName System.Windows.Forms, System.Drawing

if (-not (Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue)) {
    # Dynamically targets the logged-in user's folder path automatically
    $UserPath = $env:USERPROFILE
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d $UserPath\.gemini\antigravity\scratch\taskspring-rise\backend && npm run dev" -WindowStyle Hidden -CreateNoWindow
    Start-Sleep -Seconds 12
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrEmpty($ScriptDir)) {
    $ScriptDir = Get-Location
}
$ConfigPath = Join-Path $ScriptDir "mgg_config.json"

$userId = "taylor@mgg.edu.in"
$backendUrl = "http://localhost:4000"

if (Test-Path $ConfigPath) {
    try {
        $Config = Get-Content $ConfigPath -Raw | ConvertFrom-Json
        if ($Config.userId) { $userId = $Config.userId }
        if ($Config.backendUrl) { $backendUrl = $Config.backendUrl }
    } catch {}
}

$url = "$backendUrl/api/notifications/startup?userId=$userId"

try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 5 -ErrorAction Stop
    
    $tasks = $response.urgentTasks
    if ($tasks -and $tasks.Count -gt 0) {
        foreach ($task in $tasks) {
            $title = $task.title
            $dueDate = [DateTime]::Parse($task.dueDate).ToString("yyyy-MM-dd")
            
            $notification = New-Object System.Windows.Forms.NotifyIcon
            $notification.Icon = [System.Drawing.SystemIcons]::Information
            $notification.BalloonTipIcon = "Info"
            $notification.BalloonTipTitle = "New Task Assigned: $title"
            $notification.BalloonTipText = "Due Date: $dueDate`nStatus: $($task.status)"
            $notification.Visible = $true
            $notification.ShowBalloonTip(10000)
            
            Start-Sleep -Seconds 3
            $notification.Dispose()
        }
    }
} catch {}
