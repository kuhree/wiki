---
draft: false
publish: true
aliases:
  - Install NVIDIA Drivers
description: Guide for installing NVIDIA drivers on Debian-based systems
date: 2024-11-19
updated: 2025-02-09
tags:
  - snippets
  - tools/nvidia
  - tools/linux
up: 
jump: 
down: 
id: install-nvidia-drivers
---

## Nvidia drivers (debian-based)

### Installation

#### Two Methods:

- Package Based
	- Can be older, but has been tested
	- Updates are managed by package manager
- Run-based
	- Offers the latest drivers
	- Updates are manages by you when you download and install the latest

#### Run Based

- Purge/remove installed drivers
- Blacklist drivers
- Download latest drivers
- Extract, `chmod +x NVIDIA-…` and `./NVIDIA…`
- Use `--no-kernel-modules` option for LXC

##### Identify graphics card

```txt
~ lspci -nn | egrep -i "3d|display|vga"
04:00.0 VGA compatible controller [0300]: NVIDIA Corporation TU104 [GeForce RTX 2070 SUPER] [10de:1e84] (rev a1)
```

##### Add contrib and non-free repos to `/etc/apt/sources.list`

````txt
deb http://deb.debian.org/debian/ bookworm main contrib non-free non-free-firmware
deb-src http://deb.debian.org/debian/ bookworm main contrib non-free non-free-firmware

deb http://security.debian.org/debian-security bookworm-security main non-free non-free-firmware
deb-src http://security.debian.org/debian-security bookworm-security main non-free non-free-firmware

# bookworm-updates, to get updates before a point release is made;
# see https://www.debian.org/doc/manuals/debian-reference/ch02.en.html#_updates_and_backports
deb http://deb.debian.org/debian/ bookworm-updates main non-free non-free-firmware
deb-src http://deb.debian.org/debian/ bookworm-updates main non-free non-free-firmware```
````

In some cases, if you're aiming to install the bleeding-edge version of the NVIDIA driver from Debian Backports, you may also need to install the kernel from backports to match it. For Debian 12, you might do this with:

```txt
apt install -t bookworm-backports linux-image-amd64
```

##### Install Linux header

```txt
apt install linux-headers-$(uname -r)

# For proxmox hosts
apt install proxmox-headers-$(uname -r) make gcc acpid dkms

```

#### Package Based

##### Use nvidia-detect to determine driver version

```txt
sudo apt install nvidia-detect
```

```txt
~ nvidia-detect
Detected NVIDIA GPUs:
04:00.0 VGA compatible controller [0300]: NVIDIA Corporation TU104 [GeForce RTX 2070 SUPER] [10de:1e84] (rev a1)

Checking card:  NVIDIA Corporation TU104 [GeForce RTX 2070 SUPER] (rev a1)
Your card is supported by all driver versions.
Your card is also supported by the Tesla 470 drivers series.
It is recommended to install the
    nvidia-driver
package.
```

##### Install drivers and reboot

```txt
apt install nvidia-driver firmware-misc-nonfree
systemctl reboot
```

#### Check install

```txt
nvidia-smi
Every 0.1s: nvidia-smi                                                                                                                                                      metal-prod-1: Fri May 24 23:27:19 2024

Fri May 24 23:27:19 2024
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 525.147.05   Driver Version: 525.147.05   CUDA Version: 12.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ...  On   | 00000000:04:00.0 Off |                  N/A |
| 40%   35C    P8     9W / 120W |      1MiB /  3072MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

##### Watch Performance

```txt
watch -n0.1 nvidia-smi
```

### Install Container Toolkit

- Configure Production Repo

```txt
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
```

- Update apt and install

```txt
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
```

- Configure and restart docker daemon

```txt
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

#### Uninstall drivers

```txt
dpkg -l | grep nvidia
apt purge nvidia-*
apt purge nvidia-driver-*
apt autoclean
apt autoremove

Run the dpkg again:
dpkg -i | grep nvidia
```

### Sources

- [Nvidia GPU passthrough in LXC :: TheOrangeOne](https://theorangeone.net/posts/lxc-nvidia-gpu-passthrough/)
- [NvidiaGraphicsDrivers - Debian Wiki](https://wiki.debian.org/NvidiaGraphicsDrivers)
- [NVIDIA - ArchWiki](https://wiki.archlinux.org/title/NVIDIA)
- [Installing the NVIDIA Container Toolkit — NVIDIA Container Toolkit 1.15.0 documentation](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)
