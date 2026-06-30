@echo off
REM Ulo Linux QEMU Launcher for Windows
REM This script launches the compiled Ulo Linux ISO in QEMU with virtio optimizations.

set ISO_PATH=ulo-linux-release.iso
set MEMORY=8192
set CPU_CORES=8

if not exist "%ISO_PATH%" (
    echo Error: %ISO_PATH% not found!
    echo Please download the ISO from GitHub Actions or place it in this directory.
    pause
    exit /b 1
)

echo Launching Ulo Linux in QEMU...
qemu-system-x86_64 ^
  -m %MEMORY% ^
  -smp %CPU_CORES% ^
  -enable-kvm -cpu host ^
  -vga virtio -display sdl,gl=on ^
  -cdrom %ISO_PATH% ^
  -boot d ^
  -device virtio-balloon ^
  -net nic,model=virtio -net user

echo QEMU exited.
pause
