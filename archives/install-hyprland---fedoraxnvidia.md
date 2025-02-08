---
draft: 
publish: true
aliases:
  - install-hyprland---fedoraXnvidia
date: 2024-11-22
updated: 2024-11-23
tags: []
id: 1729283684-install-hyprland---fedoraxnvidia
---

What I know about hyprland so far.

- it's the wayland i3/bspwm (newer than sway)
- forgoes all x11 conventions for it's own new standard
  - this means it requuires it's own special ecosystem.
- primarily meant for Arch but seems to work well on Fedora/Debian as well (it's just a WM)
- configuration is declarative, this is nice. Planning to couple with [[nixos]] in the future

## Steps

Add Copr Repo for faster updates

```sh
sudo dnf copr enable solopasha/hyprland
```

Install hyprland

```sh
sudo dnf install hyprland
sudo dnf install hyprland-devel # If you want to build plugins (use hyprpm)
```

Make sure you have Nvidia set up or follow the guide in [References](#references)

Launch hyprland through sddm

Configure in `~/.config/hypr`

Install SwayNC

```sh
dnf copr enable erikreider/SwayNotificationCenter
dnf install SwayNotificationCenter
```

Install ecosystem

```sh
sudo dnf install hyprpaper hypridle hyprlock hyprpolkitagent
sudo dnf install xdg-desktop-port xdg-desktop-portal--hyprland
sudo dnf install waybar network-manager-applet
sudo dnf install cliphist wl-clipboard
```

## Sources

- https://github.com/JaKooLit/Fedora-Hyprland
- https://wiki.hyprland.org/Getting-Started/Master-Tutorial/
  - https://wiki.hyprland.org/Getting-Started/Installation/
  - https://wiki.hyprland.org/Nvidia/
- https://copr.fedorainfracloud.org/coprs/solopasha/hyprland
