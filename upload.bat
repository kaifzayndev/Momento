@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo       MOMENTO GALLERY - AUTOMATED GITHUB UPLOADER        
echo ========================================================
echo.

REM 1. Check if git is available
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Git was not found in your system PATH.
    echo.
    echo Please install Git for Windows:
    echo   https://git-scm.com/download/win
    echo.
    echo Once installed, close and re-open this script.
    echo.
    pause
    exit /b 1
)

echo [*] Git detected:
git --version
echo.

REM 2. Initialize or re-use existing git repo
if not exist ".git" (
    echo [*] Initializing Git repository...
    git init -b main
) else (
    echo [*] Git repository already initialized.
    git branch -M main
)

REM 3. Configure remote
echo [*] Configuring remote repository:
echo     https://github.com/kaifzayndev/ZAYKA-RESTAURANT.git
git remote remove origin >nul 2>nul
git remote add origin https://github.com/kaifzayndev/ZAYKA-RESTAURANT.git

REM 4. Stage all changes
echo.
echo [*] Staging all files...
git add .

REM 5. Commit changes
echo [*] Committing changes...
git commit -m "feat: complete modern dark fine-art gallery exhibition system"

REM 6. Push to repository
echo.
echo [*] Pushing to origin main...
git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo  [SUCCESS] All files uploaded to your GitHub repository!
    echo  Repo: https://github.com/kaifzayndev/ZAYKA-RESTAURANT
    echo ========================================================
) else (
    echo.
    echo [!] Push encountered an issue.
    echo If GitHub asks for authentication, please sign in or use
    echo your GitHub Personal Access Token (PAT) as the password.
)

echo.
pause
