---
draft: 
publish: true
aliases: []
date: 2024-11-24
updated: 2025-02-09
tags: []
up: 
jump: 
down: 
---

## Adding a module

```bash
git submodule add <repo> /path/to/clone
```

## Clone a repo with modules

```bash
git clone --recurse-submodules <repo>
```

Or, run the following after cloning

```bash
git submodules update --init --recursive
