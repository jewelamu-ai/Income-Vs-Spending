@echo off
echo Starting Budget Tracker Pro PWA Server...
echo.
echo If you see errors about missing icons, run this first:
echo npm install && npm run generate-icons
echo.
echo Then run this server script again.
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak > nul
start http://localhost:8000
python -m http.server 8000
pause