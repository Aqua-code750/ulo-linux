#!/usr/bin/env python3
# a) Purpose: Custom Ulo Installer script orchestrating the installation flow (no Calamares).
# c) Install/Test: Run `sudo python3 installer.py` in the live environment.
# d) Open decisions: Assumes UEFI by default. BTRFS is the default filesystem for snapshot support.

import os
import subprocess
import sys
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')

def run_cmd(cmd):
    logging.info(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        logging.error(f"Command failed: {result.stderr}")
        sys.exit(1)
    return result.stdout

def detect_qemu():
    """Detects if we are running inside QEMU/KVM to auto-enable virtio optimizations."""
    vendor = run_cmd(["cat", "/sys/class/dmi/id/sys_vendor"]).strip()
    return "QEMU" in vendor

def partition_disk(disk):
    """Partitions the disk with an EFI system partition and a BTRFS root partition."""
    logging.info(f"Partitioning {disk}...")
    run_cmd(["parted", "-s", disk, "mklabel", "gpt"])
    run_cmd(["parted", "-s", disk, "mkpart", "ESP", "fat32", "1MiB", "513MiB"])
    run_cmd(["parted", "-s", disk, "set", "1", "esp", "on"])
    run_cmd(["parted", "-s", disk, "mkpart", "primary", "btrfs", "513MiB", "100%"])

    esp_part = f"{disk}p1" if "nvme" in disk else f"{disk}1"
    root_part = f"{disk}p2" if "nvme" in disk else f"{disk}2"

    run_cmd(["mkfs.fat", "-F32", esp_part])
    run_cmd(["mkfs.btrfs", "-f", root_part])
    
    return esp_part, root_part

def mount_partitions(esp, root, mnt="/mnt"):
    """Mounts BTRFS subvolumes and EFI partition."""
    logging.info("Mounting partitions...")
    run_cmd(["mount", root, mnt])
    run_cmd(["btrfs", "su", "cr", f"{mnt}/@"])
    run_cmd(["btrfs", "su", "cr", f"{mnt}/@home"])
    run_cmd(["btrfs", "su", "cr", f"{mnt}/@snapshots"])
    run_cmd(["umount", mnt])

    run_cmd(["mount", "-o", "noatime,space_cache=v2,compress=zstd,subvol=@", root, mnt])
    os.makedirs(f"{mnt}/home", exist_ok=True)
    os.makedirs(f"{mnt}/.snapshots", exist_ok=True)
    os.makedirs(f"{mnt}/boot/efi", exist_ok=True)

    run_cmd(["mount", "-o", "noatime,space_cache=v2,compress=zstd,subvol=@home", root, f"{mnt}/home"])
    run_cmd(["mount", "-o", "noatime,space_cache=v2,compress=zstd,subvol=@snapshots", root, f"{mnt}/.snapshots"])
    run_cmd(["mount", esp, f"{mnt}/boot/efi"])

def pacstrap_base(mnt="/mnt"):
    """Installs the base system via pacstrap."""
    logging.info("Running pacstrap...")
    pkgs = ["base", "linux-zen", "linux-zen-headers", "linux-firmware", "btrfs-progs", "grub", "efibootmgr", "sudo", "networkmanager", "git"]
    if detect_qemu():
        logging.info("QEMU detected. Adding virtio guest packages...")
        pkgs.extend(["qemu-guest-agent", "spice-vdagent", "mesa", "vulkan-virtio"])
    run_cmd(["pacstrap", mnt] + pkgs)

def configure_system(mnt="/mnt"):
    """Generates fstab and runs arch-chroot scripts."""
    logging.info("Generating fstab...")
    fstab = run_cmd(["genfstab", "-U", mnt])
    with open(f"{mnt}/etc/fstab", "a") as f:
        f.write(fstab)
    
    # Note: A real installer would handle timezone, locale, grub-install via arch-chroot here
    logging.info("Basic installation complete. Ready for chroot configuration.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: sudo python3 installer.py /dev/sdX")
        sys.exit(1)
    
    target_disk = sys.argv[1]
    is_qemu = detect_qemu()
    print(f"Starting Ulo Installer. Target: {target_disk}. QEMU Detected: {is_qemu}")
    
    esp, root = partition_disk(target_disk)
    mount_partitions(esp, root)
    pacstrap_base()
    configure_system()
    print("Done! You can now arch-chroot /mnt to finish configuration.")
