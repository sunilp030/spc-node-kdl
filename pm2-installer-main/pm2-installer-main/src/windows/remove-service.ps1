Write-Host "=== Remove Service ==="

$PM2_HOME = $env:PM2_HOME
$PM2_SERVICE_DIRECTORY = $env:PM2_SERVICE_DIRECTORY

function Stop-Service {
  param([string] $name)

  $filter = "Name='$name'"
  $attempt = 0
  $maxAttempts = 10
  $service = $null

  # FIX 1 + 2: Secure loop + $null on left + CIM instead of WMI
  while (($null -eq $service) -and ($attempt -lt $maxAttempts)) {

    if ($attempt -gt 0) {
      Start-Sleep -Milliseconds 500
      Write-Host "Attempt #$($attempt) to locate service `"$name`" failed, trying again.."
    }

    # FIX 3: Replace deprecated Get-WmiObject with secure CIM cmdlet
    $service = Get-CimInstance -ClassName Win32_Service -Filter $filter -ErrorAction SilentlyContinue

    $attempt++
  }

  # FIX 4: Proper null comparison (left-side)
  if ($null -eq $service) {
    Write-Host "Could not find `"$name`" service after $maxAttempts attempts. It has likely already been uninstalled."
    return
  }

  Write-Host "Found `"$name`" service:"
  Write-Host "  State: $($service.State)"
  Write-Host "  Status: $($service.Status)"
  Write-Host "  Started: $($service.Started)"
  Write-Host "  Start Mode: $($service.StartMode)"
  Write-Host "  Service Type: $($service.ServiceType)"
  Write-Host "  Start Name: $($service.StartName)"

  if ($service.State -eq 'Stopped') {
    Write-Host "Service is already stopped."
    return
  }

  Write-Host "Sending stop command, this may take a minute.."

  # FIX 5: CIM-compatible method invocation (no legacy WMI call)
  $response = Invoke-CimMethod -InputObject $service -MethodName StopService -ErrorAction Stop

  if (($null -ne $response) -and ($response.ReturnValue -ne 0)) {
    throw "Could not stop service. Error code: $($response.ReturnValue)"
  }

  # Wait until service stops (CIM safe polling)
  do {
    Start-Sleep -Milliseconds 250
    $service = Get-CimInstance -ClassName Win32_Service -Filter $filter -ErrorAction SilentlyContinue
    if ($null -ne $service) {
      Write-Host "  Service state is: $($service.State)"
    }
  } while (($null -ne $service) -and ($service.State -ne 'Stopped'))

  Write-Host "Service stopped."
}

Write-Host "Stopping service, this may take a minute or so.."
Stop-Service -name "pm2.exe"

Write-Host "Running pm2 kill.."
pm2 kill --silent

$wd = (Get-Item -Path '.\' -Verbose).FullName

# FIX 6: Proper null-safe comparisons
if (($null -ne $PM2_SERVICE_DIRECTORY) -and (Test-Path -Path $PM2_SERVICE_DIRECTORY)) {
  Set-Location $PM2_SERVICE_DIRECTORY
}

Write-Host "Running Node service uninstall script.."

node "$wd\src\windows\service-management\uninstall.js" $PM2_SERVICE_DIRECTORY

if ($false -eq $?) {
  Set-Location $wd
  throw "Service uninstall script failed."
}

if (($null -ne $PM2_SERVICE_DIRECTORY) -and (Test-Path -Path $PM2_SERVICE_DIRECTORY)) {
  Set-Location $wd
  Write-Host "Deleting pm2 service directory `"$PM2_SERVICE_DIRECTORY`""
  Remove-Item -Path $PM2_SERVICE_DIRECTORY -Recurse -Force -ErrorAction SilentlyContinue | Out-Null
}

if (($null -ne $PM2_HOME) -and (Test-Path -Path $PM2_HOME)) {
  Write-Host "Deleting pm2 home directory `"$PM2_HOME`""
  Remove-Item -Path $PM2_HOME -Recurse -Force -ErrorAction SilentlyContinue | Out-Null
}

$PM2_PARENT_FOLDER = "$($env:ProgramData)\pm2"
if (($null -ne $PM2_PARENT_FOLDER) -and (Test-Path -Path $PM2_PARENT_FOLDER)) {
  Write-Host "Deleting `"$PM2_PARENT_FOLDER`""
  Remove-Item -Path $PM2_PARENT_FOLDER -Recurse -Force -ErrorAction SilentlyContinue | Out-Null
}

Write-Host "Resetting shell environmental variables.."
$env:PM2_HOME = $null
$env:PM2_INSTALL_DIRECTORY = $null
$env:PM2_SERVICE_DIRECTORY = $null

Write-Host "Resetting machine environmental variables.."
[Environment]::SetEnvironmentVariable("PM2_HOME", $null, "Machine")
[Environment]::SetEnvironmentVariable("PM2_INSTALL_DIRECTORY", $null, "Machine")
[Environment]::SetEnvironmentVariable("PM2_SERVICE_DIRECTORY", $null, "Machine")

Set-Location $wd

Write-Host "=== Remove Service Complete ==="