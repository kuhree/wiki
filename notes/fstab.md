---
draft: false
publish: 
aliases: []
description: 
date: 2024-11-22
updated: 2025-02-09
tags:
  - tools/linux
up: 
jump: 
down: 
banner: 
---

up::
jump::
down::

---

- Edit `fstab` so that the volume mounts automatically on reboot
	1. Open: `nano /etc/fstab`
	2. Add an entry
		- EXT4: `/dev/disk/by-uuid/UUID /mnt/point ext4 defaults 0 2`
		- NFS: `192.168.1.20:/mnt/user/downloads/ /mnt/computer2/downloads nfs defaults 0 0`
	3. Reload systemd `systemctl daemon-reload`
