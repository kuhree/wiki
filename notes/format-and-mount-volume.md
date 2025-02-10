---
draft: false
publish: true
aliases:
  - Format and Mount Volume
description: Guide for formatting and mounting volumes on Linux
date: 2024-11-19
updated: 2025-02-09
tags:
  - snippets
  - tools/linux
up: 
jump: 
down: 
id: format-and-mount-volume
---

- Find sdXX and UUID with `lsblk -f` and `lsblk`
- Format the volume w/ something ike `sudo mkfs.ext4 /dev/sdXX`
- Create a mountpoint `mkdir /mnt/point`
- Mount the volume `mount -t ext4 /dev/sdXX /mnt/point`
- Add an entry to [[fstab]] to automount a disk
