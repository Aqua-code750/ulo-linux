@echo off
echo ==================================================
echo Launching Ulo Linux in QEMU...
echo Make sure you have combined the ISO parts into 'ulo-linux.iso'
echo ==================================================
qemu-system-x86_64 -m 4G -smp 4 -cdrom ulo-linux.iso -vga virtio
pause
