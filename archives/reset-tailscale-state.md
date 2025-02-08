---
draft: false
publish: true
aliases:
  - Reset Tailscale State
description: Guide for resetting Tailscale state and configuration
date: 2024-11-19
updated: 2024-11-23
tags:
  - linux/networking
  - linux
id: reset-tailscale
---

up::
jump:: [[install-tailscale]]
down::

---

## Reset Tailscale State

Tailscale has a special ".state" file.
1. Stop the `tailscaled` service
2. Remove the file - `/var/lib/tailscale/tailscaled.state`
3. Restart the `tailscaled` service

```bash

sudo systemctl status stop tailscaled

sudo rm /var/lib/tailscale/tailscaled.state

sudo systemctl status start tailscaled

# If you haven't already enabled
# sudo systemctl status enable --now tailscaled
```

### Ansible tasks

```yml
- name: Stop tailscaled service
	ansible.builtin.service:
		name: tailscaled
		state: stopped

- name: Remove tailscale state file
	ansible.builtin.file:
		path: /var/lib/tailscale/tailscaled.state
		state: absent

- name: Start tailscaled service
	ansible.builtin.service:
		name: tailscaled
		state: started
```
