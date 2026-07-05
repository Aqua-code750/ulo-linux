@echo off
echo ==================================================
echo Launching Ulo Linux in QEMU...
echo Make sure you have combined the ISO parts into 'ulo-linux.iso'
if not exist ulo-linux.iso (
    echo [INFO] ulo-linux.iso not found! 
    echo [INFO] Automatically merging downloaded parts (partaa, partab, partac)...
    copy /b ulo-linux.iso.part* ulo-linux.iso
    echo [INFO] Merge complete!
)

qemu-system-x86_64 -m 4G -smp 4 -cdrom ulo-linux.iso -vga virtio
pause
