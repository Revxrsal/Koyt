# Define the commands
$commands = @(
    "git checkout release",
    "git reset master --hard",
    "git push",
    "git checkout master"
)

# Execute each command
foreach ($command in $commands) {
    Write-Host "Executing: $command"

    # Use Invoke-Expression to execute the command
    Invoke-Expression $command

    # Check for errors
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Command failed: $command" -ForegroundColor Red
        exit $LASTEXITCODE
    } else {
        Write-Host "Command succeeded: $command" -ForegroundColor Green
    }
}

Write-Host "All commands executed successfully" -ForegroundColor Green
