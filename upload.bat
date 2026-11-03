@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo       MOMENTO GALLERY - AUTOMATED GITHUB UPLOADER        
echo ========================================================
echo.

REM Ensure MinGit is in path if present
if exist "%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"
)

REM 1. Check if git is available
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Git was not found.
    echo Please install Git from https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [*] Using Git:
git --version
echo.

REM 2. Ensure main branch
git branch -M main

REM 3. Configure remote
echo [*] Target Repository:
echo     https://github.com/kaifzayndev/Momento.git
git remote remove origin >nul 2>nul
git remote add origin https://github.com/kaifzayndev/Momento.git

REM 4. Stage all files
echo.
echo [*] Staging all files...
git add .

REM 5. Commit
echo [*] Committing changes...
git commit -m "feat: complete modern dark fine-art gallery exhibition system" >nul 2>nul

REM 6. Push to GitHub
echo.
echo [*] Pushing to GitHub (main branch)...
echo NOTE: If prompted, enter your GitHub Username (kaifzayndev)
echo and your GitHub Personal Access Token (PAT) as the password.
echo.
git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo  [SUCCESS] All files uploaded to your GitHub repository!
    echo  https://github.com/kaifzayndev/Momento
    echo ========================================================
) else (
    echo.
    echo [!] Push failed or authentication was cancelled.
    echo To push with a Personal Access Token:
    echo 1. Go to https://github.com/settings/tokens
    echo 2. Generate a Classic Token with 'repo' scope
    echo 3. Use that token as your password when git prompts.
)

echo.
pause
