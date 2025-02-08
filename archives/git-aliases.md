---
draft: false
publish: 
aliases: []
description: 
date: 2024-11-22
updated: 2024-11-24
tags:
  - tools/git
banner: 
---

up:: [[git]]
jump::
down::[[dotfiles]]

---

[[git|Git]] aliases allow you to make little shortcuts for how you use git every day.

They're very similar to shell aliases and probably work similarly "under the hood"

## Setup

They can live in a few different places along with the rest of your [[git]] config.

- `~/gitconfig`
- `$XDG_CONFIG_HOME/git/config` *my preference
- `.git/config` of your current repo

They live in the `~/.config/git/config` file in my [[dotfiles]] and follow this structure:

```bash
[alias]
    la = "!git config -l | grep alias | cut -c 7-"
```

Here are some of my favorites.

## Status, Add, Commit

```bash
s = status -s
a = add
ap = add -p
c = commit --verbose
ca = commit -a --verbose
cm = commit -m
cam = commit -a -m
m = commit --amend --verbose
```

This allows for a workflow similar to the following.

- `g s` - scan
- `g ap` - add chunk by hunk
- `g cm chore:ci` - commit
	- oops made a mistake, fix it
		- `g cam` - add it to the commit
- `g p` - push

![[git-aliases-3.png]]

## Logging

```bash
ls = log --all --graph --decorate --date=short --oneline --pretty=format:"%C(yellow)%h\\ %ad%Cred%d\\ %Creset%s%Cblue\\ [%cn]"
ll = log --all --graph --decorate 
bs = for-each-ref --sort=-committerdate --format=\"%(color:blue)%(authordate:relative)\t%(color:red)%(authorname)\t%(color:white)%(color:bold)%(refname:short)\" refs/remotes
```

`ls` will return something like

```bash
❯ git ls
* a529c45 2024-11-22 (HEAD -> main, origin/main, origin/HEAD) feat: firefoxpwa [Khari Johnson]
* f120f0f 2024-11-22 chore: dyslexia [Khari Johnson]
* a09cf6c 2024-11-22 vm [Khari Johnson]
```

and `ll` will return something like

```bash
❯ git ll
* commit a529c45d21d2241b92889df1513d0e047e2cd529 (HEAD -> main, origin/main, origin/HEAD)
| Author: Khari Johnson <git@gvempire.com>
| Date:   Fri Nov 22 12:04:23 2024 -0500
|
|     feat: firefoxpwa
|
```

![[git-aliases-1.png]]

while `bs` will return something like

```bash
❯ git bs
2 days ago      Khari Johnson   origin
2 days ago      Khari Johnson   origin/main
```

![[git-aliases-2.png]]

## Diff

```bash
d = diff
dd = difftool
ds = diff --stat
dc = diff --cached
```

```bash
❯ git ds
 packages.nix | 1 +
 1 file changed, 1 insertion(+)
❯ git d
diff --git a/packages.nix b/packages.nix
index d103506..4a033f3 100644
--- a/packages.nix
+++ b/packages.nix
@@ -80,6 +80,7 @@
     pkgs.udiskie
     pkgs.xdg-user-dirs
     pkgs.xdg-utils
+    pkgs.nfs-utils
   ];

   gtk = [
```

`dd` opens the diff in my editor

```bash
❯ git dd

Viewing (1/1): 'packages.nix'
Launch 'nvimdiff' [Y/n]?
```

![[git-aliases-4.png]]

## Checkout

```bash
co = checkout
cob = checkout -b
```

Don't really use these often,

> [!tip] but I'll take this time to note that using [switch](https://git-scm.com/docs/git-switch) is now recommended instead of `checkout`.
