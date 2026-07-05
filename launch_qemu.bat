@echo off
setlocal
echo ==================================================
echo      Starting Ulo Linux in QEMU (Testing Mode)
echo ==================================================
echo.

:: Find the first ISO file in the directory
set "ISO_FILE="
for %%f in (*.iso) do (
    set "ISO_FILE=%%f"
    goto :found
)

:found
if "%ISO_FILE%"=="" (
    echo [ERROR] No .iso file found in this directory!
    echo Please extract the downloaded ulo-linux-iso.zip file right here in the folder.
    echo.
    pause
    exit /b 1
)

echo Found ISO image: %ISO_FILE%
echo Booting your custom operating system...
echo.

:: Check if QEMU is installed in the default Windows location
set "QEMU_PATH=C:\Program Files\qemu\qemu-system-x86_64.exe"

if exist "%QEMU_PATH%" (
    "%QEMU_PATH%" -m 4G -smp 2 -cdrom "%ISO_FILE%" -vga std -kernel vmlinuz -initrd initrd -append "boot=casper rw init=/bin/bash"
) else (
    :: Fallback to checking if QEMU is already in the system PATH
    qemu-system-x86_64 -m 4G -smp 2 -cdrom "%ISO_FILE%" -vga std -kernel vmlinuz -initrd initrd -append "boot=casper rw init=/bin/bash"
)

:: If QEMU fails, output a helpful message
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] QEMU failed to launch or is not installed.
    echo.
    echo To run this script, you need QEMU installed on Windows.
    echo You can download the Windows installer here:
    echo https://qemu.weilnetz.de/w64/
    echo.
    pause
)
