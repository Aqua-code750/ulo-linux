#!/usr/bin/env bash
# a) Purpose: Defines the Arch ISO build configuration for Ulo Linux.
# c) Install/Test: `mkarchiso -v -w /tmp/archiso-tmp -o /tmp/archiso-out /path/to/ulo-iso-profile/`
# d) Open decisions: Using systemd-boot/GRUB combination for the ISO bootloader. Need confirmation on ISO label (ULO_2026).

iso_name="ulo-linux"
iso_label="ULO_$(date +%Y%m)"
iso_publisher="Ulo Linux <https://ulo.linux>"
iso_application="Ulo Linux Live/Rescue CD"
iso_version="$(date +%Y.%m.%d)"
install_dir="arch"
buildmodes=('iso')
bootmodes=('bios.syslinux.mbr' 'bios.syslinux.eltorito'
           'uefi-ia32.grub.esp' 'uefi-x64.grub.esp'
           'uefi-ia32.grub.eltorito' 'uefi-x64.grub.eltorito')
arch="x86_64"
pacman_conf="pacman.conf"
airootfs_image_type="erofs"
airootfs_image_tool_options=('-zlz4hc,12' -E ztailpacking)
file_permissions=(
  ["/etc/shadow"]="0:0:400"
  ["/etc/gshadow"]="0:0:400"
  ["/root"]="0:0:750"
  ["/root/.automated_script.sh"]="0:0:755"
  ["/etc/polkit-1/rules.d"]="0:0:750"
  ["/etc/sudoers.d"]="0:0:750"
)
