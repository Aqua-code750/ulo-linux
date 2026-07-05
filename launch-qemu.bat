@echo off
echo ==================================================
echo Launching Ulo Linux in QEMU...
echo ==================================================

set QEMU_PATH=qemu-system-x86_64
if exist "C:\Program Files\qemu\qemu-system-x86_64.exe" set QEMU_PATH="C:\Program Files\qemu\qemu-system-x86_64.exe"

echo [INFO] Booting Ulo Linux Direct Kernel mode...
%QEMU_PATH% -m 4G -smp 4 -kernel vmlinuz -initrd initrd -append "boot=casper quiet splash" -drive file=ulo-linux.iso,format=raw,media=cdrom -vga std
pause
