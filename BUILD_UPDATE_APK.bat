@echo off
title KiranaStore - Build & Update Android APK
color 0B

echo ===============================================================================
echo            KIRANASTORE - 1-CLICK ANDROID APK BUILD & SYNC TOOL
echo                     Developed by Akarshan Mishra
echo ===============================================================================
echo.

echo [Step 1/3] Compiling React Frontend with Vite...
cd /d "%~dp0frontend"
call npm run build
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo [ERROR] Frontend build failed! Please check for code errors.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [Step 2/3] Syncing Web Assets to Android via Capacitor...
call .\node_modules\.bin\capacitor.cmd sync android
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo [ERROR] Capacitor sync failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [Step 3/3] Building Native Android APK (assembleDebug)...
cd /d "%~dp0frontend\android"
REM --------------------------------------------------------------------
REM Capacitor 8 / Android Gradle Plugin 8.13 require a JDK 17+ to build.
REM The default 'java' on PATH is Java 8, which makes Gradle fail with:
REM  "Dependency requires at least JVM runtime version 11. This build uses a Java 8 JVM."
REM So auto-select the installed JDK21 (if found) before running gradlew.
REM --------------------------------------------------------------------
set "NEW_JAVA_HOME="
if exist "C:\Program Files\Android\Android Studio\jbr" set "NEW_JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
if exist "%LOCALAPPDATA%\Android\Android Studio\jbr" set "NEW_JAVA_HOME=%LOCALAPPDATA%\Android\Android Studio\jbr"
for /f "delims=" %%J in ('dir /b /ad "%USERPROFILE%\AppData\Local\JDK21" 2^>nul') do set "NEW_JAVA_HOME=%USERPROFILE%\AppData\Local\JDK21\%%J"
for /d %%J in ("C:\Program Files\Java\jdk-17*" "C:\Program Files\Java\jdk-21*" "C:\Program Files\Eclipse Adoptium\jdk-17*" "C:\Program Files\Eclipse Adoptium\jdk-21*") do if exist "%%J" set "NEW_JAVA_HOME=%%J"

if defined NEW_JAVA_HOME (
    set "JAVA_HOME=%NEW_JAVA_HOME%"
    set "PATH=%NEW_JAVA_HOME%\bin;%PATH%"
    echo  [info] Using JDK: %JAVA_HOME%
) else (
    echo  [warn] Specific JDK17+ folder not found, using default JAVA_HOME.
)
call gradlew.bat assembleDebug

if %ERRORLEVEL% EQU 0 (
    color 0A
    echo.
    echo ===============================================================================
    echo                     BUILD SUCCESSFUL! APK CREATED
    echo ===============================================================================
    
    REM Copy APK to Project Root for 1-Click Access
    if exist "%~dp0frontend\android\app\build\outputs\apk\debug\app-debug.apk" (
        copy /Y "%~dp0frontend\android\app\build\outputs\apk\debug\app-debug.apk" "%~dp0KiranaStore_Latest.apk" >nul
        echo.
        echo  [OK] Fresh APK generated at:
        echo       %~dp0KiranaStore_Latest.apk
        echo.
        echo  Opening folder in Windows Explorer...
        explorer.exe /select,"%~dp0KiranaStore_Latest.apk"
    )
) else (
    echo.
    echo -------------------------------------------------------------------------------
    echo [NOTE] Capacitor Android project has been 100%% synced with all new changes!
    echo        You can also open Android Studio directly with:
    echo        cd frontend ^&^& npx cap open android
    echo -------------------------------------------------------------------------------
)

echo.
echo ===============================================================================
echo  Done! Press any key to close this window...
echo ===============================================================================
pause >nul
