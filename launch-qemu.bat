@echo off
echo ==================================================
echo Launching Ulo Linux in QEMU...
echo Make sure you have combined the ISO parts into 'ulo-linux.iso'
if not exist ulo-linux.iso (
    echo [INFO] ulo-linux.iso not found! 
    echo [INFO] Automatically merging downloaded parts partaa, partab, partac...
    copy /b ulo-linux.iso.part* ulo-linux.iso
    echo [INFO] Merge complete!
)

set QEMU_PATH=qemu-system-x86_64
if exist "C:\Program Files\qemu\qemu-system-x86_64.exe" (
    set QEMU_PATH="C:\Program Files\qemu\qemu-system-x86_64.exe"
)

%QEMU_PATH% -m 4G -smp 4 -cdrom ulo-linux.iso -vga virtio
pause
