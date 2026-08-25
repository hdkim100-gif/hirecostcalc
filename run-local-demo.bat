@echo off
REM Double-click this file to build and run HireCost locally, then open it
REM in your default browser. Closing the "HireCost local server" window
REM stops the site.

cd /d "%~dp0"
set "LOGFILE=%~dp0run-local-demo.log"

echo HireCost local demo - %date% %time% > "%LOGFILE%"
echo [step] cwd is: %cd% >> "%LOGFILE%"

if exist node_modules goto :skip_install

echo [step] installing dependencies >> "%LOGFILE%"
echo Installing dependencies (first run only, this can take a minute)...
call npm install >> "%LOGFILE%" 2>&1
echo [step] install exit code %errorlevel% >> "%LOGFILE%"
if errorlevel 1 goto :error

:skip_install
echo [step] starting build >> "%LOGFILE%"
echo Building the production site...
call npm run build >> "%LOGFILE%" 2>&1
echo [step] build exit code %errorlevel% >> "%LOGFILE%"
if errorlevel 1 goto :error

echo [step] launching server window >> "%LOGFILE%"
echo Starting local server...
start "HireCost local server" cmd /k "npx serve out -l 3000"

echo [step] waiting for port 3000 >> "%LOGFILE%"
echo Waiting for the server to come up...
set READY=0
set /a COUNT=0

:waitloop
set /a COUNT+=1
curl.exe -s -o nul -f http://localhost:3000
if %errorlevel%==0 (
  set READY=1
  goto :openbrowser
)
if %COUNT% geq 30 goto :openbrowser
timeout /t 1 /nobreak >nul
goto :waitloop

:openbrowser
echo [step] opening browser, ready=%READY% >> "%LOGFILE%"
start "" http://localhost:3000

echo.
if %READY%==1 (
  echo HireCost is running at http://localhost:3000
) else (
  echo The server is taking longer than expected. If the page shows an error,
  echo wait a few seconds and refresh it. Details were saved to:
  echo   %LOGFILE%
)
echo Close the "HireCost local server" window to stop the site.
pause
exit /b 0

:error
echo.
echo Something went wrong. Full details were saved to:
echo   %LOGFILE%
pause
exit /b 1
