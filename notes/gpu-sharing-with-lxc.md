---
draft: false
publish: true
aliases:
  - GPU Sharing with LXC
description: Guide for sharing NVIDIA GPUs with LXC containers
date: 2024-11-19
updated: 2025-02-09
tags:
  - tools/nvidia
  - tools/linux
up: 
jump: 
down: 
id: gpu-sharing-with-lxc
---

## GPU Sharing with LXC

### Sources

- [NVIDIA GPU Passthrough in Proxmox LXCs • clait.sh](https://clait.sh/posts/gpu-passthrough-proxmox/)
- [NVidia Proxmox + LXC · GitHub](https://gist.github.com/egg82/90164a31db6b71d36fa4f4056bbee2eb#file-proxmox_nvidia-md)
- [Nvidia GPU passthrough in LXC -- TheOrangeOne](https://theorangeone.net/posts/lxc-nvidia-gpu-passthrough/)

### Troubleshooting

#### Check Device ids

- Run `ls -ls /dev/nvidia*`

```shell
🚀 ❯ ls /dev/nvidia*
crw-rw-rw- 1 root root 195,   0 May 27 14:49 /dev/nvidia0
crw-rw-rw- 1 root root 195,   1 May 27 14:49 /dev/nvidia1
crw-rw-rw- 1 root root 195, 255 May 27 14:49 /dev/nvidiactl
crw-rw-rw- 1 root root 195, 254 May 27 14:50 /dev/nvidia-modeset
crw-rw-rw- 1 root root 234,   0 May 27 14:50 /dev/nvidia-uvm
crw-rw-rw- 1 root root 234,   1 May 27 14:50 /dev/nvidia-uvm-tools

/dev/nvidia-caps:
total 0
cr-------- 1 root root 238, 1 May 27 14:50 nvidia-cap1
cr--r--r-- 1 root root 238, 2 May 27 14:50 nvidia-cap2
```

- Check lxc config at `/etc/pve/lxc/<id>.conf`, match ids with the numbers from above

```txt
lxc.cgroup2.devices.allow: c 195:* rwm
lxc.cgroup2.devices.allow: c 235:* rwm
lxc.cgroup2.devices.allow: c 510:* rwm
lxc.mount.entry: /dev/nvidia0 /dev/nvidia0 none bind,optional,create=file
lxc.mount.entry: /dev/nvidia1 /dev/nvidia1 none bind,optional,create=file
lxc.mount.entry: /dev/nvidiactl /dev/nvidiactl none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-modeset /dev/nvidia-modeset none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-uvm /dev/nvidia-uvm none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-uvm-tools /dev/nvidia-uvm-tools none bind,optional,create=file
```

#### Confirm `nvidia-smi` in the LXC

When `/usr/bin/nvidia-smi` is a folder instead of an executable, the error `permission denied: nvidia-smi` occurs. To fix:

- Remove the current folder (or back it up)

```txt
sudo rm -r /usr/bin/nvidia-smi
```

- Create a new symlink

```txt
ln -sfn /etc/alternatives/nvidia--nvidia-smi /usr/bin/nvidia-smi
```

- Try `nvidia-smi`

```txt
🚀 ❯ nvidia-smi
Mon May 27 19:37:38 2024
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 555.42.02              Driver Version: 555.42.02      CUDA Version: 12.5     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 2070 ...    On  |   00000000:01:00.0 Off |                  N/A |
| 41%   36C    P8             17W /  215W |       1MiB /   8192MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
|   1  NVIDIA GeForce GTX 1060 3GB    On  |   00000000:02:00.0 Off |                  N/A |
| 42%   43C    P8              6W /  120W |       2MiB /   3072MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI        PID   Type   Process name                              GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|  No running processes found                                                             |
+-----------------------------------------------------------------------------------------+
```

#### Check host modules

- View `/etc/modules.load.d/modules.conf`

```txt
nvidia
nvidia_uvm
```

- Update initramfs and reboot

```txt
update-initramfs -u -k all
reboot
```

#### Modprobe

```txt
sudo modprobe --remove nvidia_uvm
sudo modprobe nvidia_uvm
```
