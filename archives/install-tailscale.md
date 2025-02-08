---
draft: false
publish: true
aliases:
  - Install Tailscale
description: Guide for installing and configuring Tailscale VPN
date: 2024-11-19
updated: 2024-11-24
tags:
  - snippets
  - linux/networking
  - linux
id: install-tailscale
---

up::
jump::
down:: [[reset-tailscale-state]]

---

## LXC

	
- Add the following lines to `/etc/pve/lxc/<ct-id>.conf`
	- `lxc.cgroup2.devices.allow: c 10:200 rwm`
	- `lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file`
