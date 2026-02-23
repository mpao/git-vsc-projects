@echo off
REM Git Projects Welcome - Extension Installation Script (Windows)

setlocal enabledelayedexpansion

echo.
echo 📦 Git Projects Welcome - Extension Installer
echo ================================================
echo.

REM Check if VS Code is installed
where code >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Error: VS Code is not installed or not in PATH
    echo Please install VS Code from https://code.visualstudio.com
    pause
    exit /b 1
)

REM Install dependencies
echo 📥 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error: npm install failed
    pause
    exit /b 1
)

REM Compile TypeScript
echo.
echo 🔨 Compiling TypeScript...
call npm run compile
if %errorlevel% neq 0 (
    echo ❌ Error: TypeScript compilation failed
    pause
    exit /b 1
)

REM Package the extension (using npx to avoid global permission issues)
echo.
echo 📦 Packaging extension...
call npx @vscode/vsce package
if %errorlevel% neq 0 (
    echo ❌ Error: vsce package failed
    pause
    exit /b 1
)

REM Install the extension
echo.
echo 🚀 Installing extension in VS Code...

for /f "delims=" %%A in ('dir /b /o-d git-projects-welcome-*.vsix 2^>nul ^| findstr /r ".*" ^| call set /a count+=1 ^& if "!count!"=="1" echo %%A') do (
    set VSIX_FILE=%%A
)

if not defined VSIX_FILE (
    echo ❌ Error: VSIX file not found
    pause
    exit /b 1
)

call code --install-extension !VSIX_FILE!

echo.
echo ✅ Installation complete!
echo.
echo 📝 Next steps:
echo 1. Open VS Code settings (Ctrl+,)
echo 2. Search for 'gitProjectsWelcome.repositoryDirectories'
echo 3. Add your project directories to the array
echo 4. Click the 'projects' button in the status bar to view your repositories
echo.
pause
