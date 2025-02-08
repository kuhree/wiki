---
draft: false
publish: true
aliases: []
description: 
date: 2024-11-22
updated: 2024-11-23
tags:
  - tools/packer
  - snippets
  - linux/networking
  - linux
banner-alt: 
banner: 
---

up:: [[nixos]]
jump::
down::

---

Quick one: If you're running packer from a NixOS host, make sure you enable the firewall ports.

This did the trick for me.

```hcl
firewall = {
	enable = true;
	...
	allowedTCPPortRanges = [ 
		{ from = 8000; to = 9000; } # Packer/Dev
	];
};
```
