@echo off
echo ========================================
echo   Budget Tracker Pro - PWA Launcher
echo ========================================
echo.
echo This will generate PWA icons and start a local web server.
echo.
echo Requirements: Python 3.x
echo If Python is not installed, download from: https://python.org
echo.
echo Press any key to continue...
pause > nul

echo.
echo Generating PWA icons...
python generate_icons_simple.py

if errorlevel 1 (
    echo.
    echo Warning: Could not generate icons. Using SVG fallback.
    echo You can still run the PWA, but icons may not display properly.
    echo.
    pause
)

echo.
echo Starting server on http://localhost:8000
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak > nul

start http://localhost:8000

python -m http.server 8000

echo.
echo Server stopped. Press any key to exit...
pause > nul