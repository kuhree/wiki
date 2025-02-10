---
draft: false
publish: true
aliases:
  - Mount NFS Drive
description: Guide for mounting NFS drives on Linux systems
date: 2024-11-19
updated: 2025-02-09
tags:
  - tools/nfs
  - snippets
  - tools/linux
up: 
jump: 
down: 
id: mount-nfs-drive
---

To mount an external NFS share on a Linux Ubuntu system, you can use the mount command. Here is a step-by-step guide:

## Install the NFS client package:

`sudo apt install nfs-common`

> [!info] I've also seen `nfs-utils` or `nfs-client` depening on distro

## Create a mount point for the NFS share:

`sudo mkdir /mnt/nfs`

## Mount the NFS share:

`sudo mount -t nfs4 server:/exported/share /mnt/nfs`

Replacing `server` with the IP address of the NFS server, `exported/share` and `/mnt/nfs` with the directory name on the NFS server and the mount point you created earlier.

You should end up with something like this:

`sudo mount -t nfs4 192.168.2.0:/NFS_share /mnt/nfs`

> [!info] The mount command mounts the NFS share temporarily. To make the mount persistent across reboots, add the mount point to the [[fstab]] file with an entry like below.
> `192.168.2.0:/NFS_share /mnt/nfs nfs4 defaults,vers=4.1 0 0`

## Unmounting the NFS share:

`sudo umount /mnt/nfs`
