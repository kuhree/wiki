---
draft: false
publish: true
aliases:
  - Mount NFS to LXC
description: Guide for mounting NFS shares in LXC containers
date: 2024-11-19
updated: 2025-02-09
tags:
  - tools/proxmox
  - tools/nfs
  - snippets
  - tools/linux
up: 
jump: 
down: 
---

up:: [[mount-nfs-drive]]

---

## Proxmox Setup

1. Access your nodes shell
    1. **Proxmox > Your Node > Shell**
2. Create a mounting point for the volume
   `mkdir /mnt/computer2/downloads`
4. Edit [[fstab]] so that the volume mounts automatically on reboot
4. Mount shares `mount -a`
5. Add the pointing point to your LXC
	1. Open: `nano /etc/pve/lxc/101.conf`
	2. Add a mountpoint 
		 `mp0: /mnt/computer2/downloads/,mp=/downloads`

## LXC Setup

1. Update the LXC user's permissions
   `groupadd -g 10000 lxc_shares`
	 `usermod -aG lxc_shares root`
> [!info]
> I think you can use whatever group name you want as long as you use again in the next step.

2. Restart the LXC
3. Verify access to the mountpoint at `/downloads`
