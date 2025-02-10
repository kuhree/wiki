---
draft: 
publish: true
aliases:
  - NixOS
date: 2024-11-22
updated: 2025-02-09
tags: []
up: 
jump: 
down: 
id: 1729227916-nixos
---

up:: [[operating-system]]
jump::
down::

---

NixOS is based on Nix, a purely functional package management system. Nix stores all packages in isolation from each other under paths such as `/nix/store`. This let's the system reuse the same packages across configurations, dependencies, etc.

Default config: `/etc/nixos/configuration.nix`

Add packages to `environment/systemPackages`

After editing,

`sudo nixos-rebuild switch` to load the latest version and add an entry to the grub bootloader
`sudo nixos-rebuild test` to load the latest version, without saving to grub
`sudo nix-collect-grabage --delete-older-than 15d` to remove older system versions/packages

Updating packages - by default `nixpkgs` is pinned to certain `channels` (upstream, unstable, and LTS e.g. 23.11). Nix Flakes makes managing deps easier by pinning certain deps outside of he current channel. Makng resolving deps easier. Think npm/yarn/bun link or something.

Add `"flakes"` to the `nix.settings.experimental-features` option to enable. Rebuild.

Run `cd /etc/nixos && sudo nix flake init --template github.com/vimjoyer/flake-starter-config` to init a basic flakes file.

To rebuild with flakes enabled, you need to run `sudo nixos-rebuild switch --flake /etc/nixos#default` where the path is to the flakes directory

A good configuration structure:

```txt
/etc/nixos
|-flake.nix
|-flake.lock
|-modules/
	|-nixos/
	|-home-manager/
|-hosts/
	|-default/
		|-configuration.nix
		|-hardware-configuration.nix
		|-home.nix
	|-srv/
		|-configuration.nix
		|-hardware-configuration.nix
		|-home.nix
```

Now you can change config using cmd like `sudo nixos-rebuild switch --flake /etc/nixos#srv`

## Modules

Nix code to extend configuration by setting options or providing new ones

`fn(inputs) -> map[options]`

Every modules imported has access to all other options from all other modules.

### Home Manager

A module enable editing a user's home directory.

## Reference

- [How Nix Works | Nix & NixOS](https://nixos.org/guides/how-nix-works/)
- [GitHub - NixOS/nixpkgs: Nix Packages collection & NixOS](https://github.com/NixOS/nixpkgs?tab=readme-ov-file)
- [Nixpkgs Reference Manual](https://nixos.org/manual/nixpkgs/stable/)
- [NixOS Manual](https://nixos.org/manual/nixos/stable/#preface)
- [Youtube](https://www.youtube.com/watch?v=a67Sv4Mbxmc&list=PLko9chwSoP-15ZtZxu64k_CuTzXrFpxPE)
- [hlissner/dotfiles](https://github.com/hlissner/dotfiles)
- [nix.dev](https://nix.dev)
