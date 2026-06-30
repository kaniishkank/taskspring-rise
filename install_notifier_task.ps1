# install_notifier_task.ps1
# Automates the registration of the MGG Startup Notifier task in Windows Task Scheduler.
# Run this script as Administrator to register the task successfully.

$TaskName = "MGGStartupNotifier"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrEmpty($ScriptDir)) {
    $ScriptDir = Get-Location
}
$ScriptPath = Join-Path $ScriptDir "mgg_startup_notifier.ps1"

if (-not (Test-Path $ScriptPath)) {
    Write-Error "Could not find the startup notifier script at: $ScriptPath. Please make sure the path is correct."
    exit 1
}

Write-Host "Registering scheduled task '$TaskName' to run at Windows Logon..."

try {
    # 1. Define the action to run PowerShell hidden in the background bypass execution policies
    $Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`""
    
    # 2. Trigger the notification at logon of any user
    $Trigger = New-ScheduledTaskTrigger -AtLogOn
    
    # 3. Optimize settings for laptop devices (allow battery start, etc.)
    $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    
    # 4. Register the task (overwrite if exists)
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Description "Mahatma Global Gateway TaskFlow Startup Notifier" -Force
    
    Write-Host "Successfully registered scheduled task '$TaskName'!"
    Write-Host "To test manually, run: Start-ScheduledTask -TaskName '$TaskName'"
} catch {
    Write-Error "Failed to register scheduled task. Ensure you are running PowerShell as an Administrator."
}
