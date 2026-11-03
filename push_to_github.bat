@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo   MoneyTrack - Push to GitHub
echo   Remote: https://github.com/sonali-Suchismita123/money-track--personal-expense-management-system.git
echo ===================================================
echo.

set "GIT_EXE=C:\Users\HP\AppData\Local\Programs\Git\cmd\git.exe"
if not exist "%GIT_EXE%" (
    where git >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        set "GIT_EXE=git"
    ) else (
        echo [ERROR] Git could not be located.
        pause
        exit /b 1
    )
)

echo Using Git: %GIT_EXE%
echo Staging and committing any pending changes...
"%GIT_EXE%" add .
"%GIT_EXE%" commit -m "Update MoneyTrack project files" >nul 2>&1

echo.
echo Pushing branch 'main' to GitHub remote 'origin'...
"%GIT_EXE%" push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===================================================
    echo   SUCCESS: Project successfully pushed to GitHub!
    echo ===================================================
) else (
    echo.
    echo [NOTICE] Push requires GitHub authentication.
    echo If a browser window opened, please complete the sign-in.
    echo Or you can push with a Personal Access Token (PAT):
    echo   "%GIT_EXE%" push https://^<YOUR_GITHUB_TOKEN^>@github.com/sonali-Suchismita123/money-track--personal-expense-management-system.git main
)

echo.
pause
