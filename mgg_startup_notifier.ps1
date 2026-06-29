# mgg_startup_notifier.ps1
# Native Windows OS startup task notifier for Mahatma Global Gateway.
# Reads user config, queries upcoming tasks/notifications, and pops up native OS toasts.

# Load Windows Runtime (WinRT) Toast Notification assemblies
try {
    [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType=WindowsRuntime] | Out-Null
    [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType=WindowsRuntime] | Out-Null
    $HasWinRT = $true
} catch {
    $HasWinRT = $false
    Write-Warning "WinRT assemblies not fully supported on this shell session. Falling back to PowerShell notification wrappers."
}

# Locate config file in the script's directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrEmpty($ScriptDir)) {
    $ScriptDir = Get-Location
}
$ConfigPath = Join-Path $ScriptDir "mgg_config.json"

# Create a default config if it doesn't exist
if (-not (Test-Path $ConfigPath)) {
    $DefaultConfig = @{
        userId = "taylor@mgg.edu.in"
        backendUrl = "http://localhost:4000"
    }
    $DefaultConfig | ConvertTo-Json | Out-File $ConfigPath -Encoding utf8
    Write-Host "Created default config file at $ConfigPath"
}

# Read configuration
$Config = Get-Content $ConfigPath | ConvertFrom-Json
$UserId = $Config.userId
$BackendUrl = $Config.backendUrl
$StartupUrl = "$BackendUrl/api/notifications/startup?userId=$UserId"

Write-Host "Pinging startup notifications endpoint for user: $UserId at $StartupUrl"

# Function to trigger native Windows Toast Notification
function Show-MggToast {
    param(
        [string]$Title,
        [string]$Message
    )
    
    if ($HasWinRT) {
        # Standard native Win10/11 XML Toast Template
        $ToastXml = @"
<toast>
    <visual>
        <binding template="ToastGeneric">
            <text>$Title</text>
            <text>$Message</text>
        </binding>
    </visual>
</toast>
"@
        $XmlDocument = New-Object Windows.Data.Xml.Dom.XmlDocument
        $XmlDocument.LoadXml($ToastXml)
        
        # Use a registered AppId for Mahatma Global Gateway to display clean toasts
        $AppId = "Mahatma Global Gateway TaskFlow"
        [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($AppId).Show($XmlDocument)
    } else {
        # Fallback to standard system tray balloon tip
        Add-Type -AssemblyName System.Windows.Forms
        $Global:balloon = New-Object System.Windows.Forms.NotifyIcon
        $path = (Get-Process -id $pid).Path
        $balloon.Icon = [System.Drawing.Icon]::ExtractAssociatedIcon($path)
        $balloon.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Info
        $balloon.BalloonTipText = $Message
        $balloon.BalloonTipTitle = $Title
        $balloon.Visible = $true
        $balloon.ShowBalloonTip(10000)
    }
}

try {
    # Request data from backend Express startup API
    $Response = Invoke-RestMethod -Uri $StartupUrl -Method Get -TimeoutSec 15
    
    # Process unnotified system notifications
    if ($Response.notifications -and $Response.notifications.Count -gt 0) {
        foreach ($Notification in $Response.notifications) {
            $Title = "TaskFlow Notification: " + $Notification.title
            $Msg = $Notification.message
            Show-MggToast -Title $Title -Message $Msg
            Start-Sleep -Seconds 2  # Pause slightly between toasts to prevent overlaps
        }
    }
    
    # Process urgent/overdue tasks
    if ($Response.urgentTasks -and $Response.urgentTasks.Count -gt 0) {
        $Count = $Response.urgentTasks.Count
        $Title = "Urgent Tasks Pending"
        $Msg = "You have $Count urgent or overdue task(s) requiring your attention!"
        Show-MggToast -Title $Title -Message $Msg
    }
    
} catch {
    Write-Error "Failed to connect to Mahatma Global Gateway backend. Ensure the server is running."
}
