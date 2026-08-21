@echo off
title KiranaStore - Public Online Cloud Tunnel (Multi-Network Sync)
color 0B
cls
echo ===============================================================================
echo     KIRANASTORE - INSTANT ONLINE CLOUD TUNNEL (MULTI-NETWORK SYNC)
echo ===============================================================================
echo.
echo  This script creates a free secure public HTTPS link for your local backend (Port 8000).
echo  Use this URL in your Customer Mobile APK to sync seamlessly on ANY 4G/5G network!
echo.
echo  ===============================================================================
echo  HOW TO USE:
echo  1. Leave this window RUNNING in the background.
echo  2. Look for the URL below ending with '.trycloudflare.com' or '.loca.lt'.
echo  3. Open Customer App -> Profile -> 'Cloud Sync & Server Connection'.
echo  4. Paste the URL, tap 'Test Connection', and tap 'Save & Sync'!
echo  ===============================================================================
echo.
echo Starting Public Cloud Tunnel...
echo.

npx --yes cloudflared tunnel --url http://localhost:8000

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Cloudflare tunnel failed. Trying LocalTunnel fallback...
    npx --yes localtunnel --port 8000
)

echo.
pause
