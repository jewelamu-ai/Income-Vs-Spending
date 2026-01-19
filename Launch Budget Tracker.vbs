' Budget Tracker Pro Launcher
' This script launches the PWA correctly by running the batch file

Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "run-pwa.bat", 0, false
Set WshShell = Nothing