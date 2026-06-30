# a) Purpose: QEMU optimization guide for users running Ulo Linux as a VM.
# c) Install/Test: Apply these arguments when launching `qemu-system-x86_64` or via Libvirt XML.
# d) Open decisions: Recommending `virtio-vga-gl` as the default GPU for best compatibility and 3D acceleration.

# Ulo Linux QEMU Tuning Guide

Ulo Linux is a "QEMU-first citizen". If you are running Ulo inside a VM, use the following configurations to achieve near-native performance.

## 1. QEMU Command Line Arguments (Libvirt equivalents provided)

### CPU Topology & Passthrough
Pass the host CPU model directly to the guest for maximum instruction set compatibility (AVX2, AVX512).
```bash
-cpu host,migratable=no,+invtsc \
-smp 8,sockets=1,cores=8,threads=1 \
```

### 3D Accelerated Graphics (virgl)
Ulo ships with Mesa drivers pre-installed for `virtio-gpu`. Enable OpenGL rendering on the host:
```bash
-device virtio-vga-gl \
-display sdl,gl=on \ # or gtk,gl=on / spice-app,gl=on
```

### Memory & Ballooning
Allow dynamic memory management:
```bash
-m 8192 \
-device virtio-balloon \
```

### Disk I/O (virtio-blk or virtio-scsi)
For the root filesystem, `virtio-blk` is the fastest standard block device:
```bash
-drive file=ulo.qcow2,format=qcow2,if=virtio,cache=none,aio=native \
```
*Note: Ulo Installer automatically optimizes BTRFS mount flags for SSD/virtio.*

## 2. Full GPU Passthrough (VFIO)
For gaming, Ulo supports seamless VFIO passthrough. 
1. Pass the PCIe device: `-device vfio-pci,host=01:00.0,x-vga=on`
2. Boot Ulo Linux. GameMode and MangoHUD will automatically detect the discrete GPU and utilize it for rendering natively.
