Add-Type -AssemblyName System.Windows.Forms, System.Drawing

$userId = "taylor@mgg.edu.in"
$url = "http://localhost:4000/api/notifications/startup?userId=$userId"

try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 5 -ErrorAction Stop
    
    # Target 'urgentTasks' where the active assignments live!
    $tasks = $response.urgentTasks

    if ($tasks -and $tasks.Count -gt 0) {
        # Loop through each urgent task found
        foreach ($task in $tasks) {
            $title = $task.title
            # Format the ISO date nicely for the user
            $dueDate = [DateTime]::Parse($task.dueDate).ToString("yyyy-MM-dd")
            
            # Trigger Native Windows Balloon/Toast Notification
            $notification = New-Object System.Windows.Forms.NotifyIcon
            $notification.Icon = [System.Drawing.SystemIcons]::Information
            $notification.BalloonTipIcon = "Info"
            $notification.BalloonTipTitle = "New Task Assigned: $title"
            $notification.BalloonTipText = "Due Date: $dueDate`nStatus: $($task.status)"
            $notification.Visible = $true
            $notification.ShowBalloonTip(10000)
            
            Start-Sleep -Seconds 3 # Pause slightly between multiples
            $notification.Dispose()
        }
    }
} catch {
    # Fail silently on system logons
}
