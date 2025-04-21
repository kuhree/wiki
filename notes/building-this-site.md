---
draft: false
publish: true
aliases: []
date: 2024-11-22
updated: 2025-02-23
tags:
  - tools/quartz
  - tools/obsidian
  - tools/astro
  - post
up: 
jump: 
down: 
id: building-this-site
---

up:: [[index]]
jump::
down:: [[quartz]], [[obsidian]]

---

This site is interesting.

I've been using [[obsidian]] for the last few years to take personal notes.

I already have an Astro site where some of the [[tags/post]] came from. The rest came from the writing mentioned above.

The astro site used the [Content Collections](https://docs.astro.build/en/guides/content-collections/) which let me glob a bunch of files and enforce a structure before building the page into the site. Pretttty cool. So I could use that, but I'd have to rebuild some of obsidian's features from scratch. A valiant effort, but not one for me right now. I also considered [[svelte]] and [[hugo]]. Which has the same or similar "issues."

You see, another problem is that I use a lot of different computers. Laptops, desktops, phones -- on different [[operating-system]]s, new platforms, across upgrades. A separate Astro site get's hard to to maintain for me in my writing. Another thing to pull and clone and sync. It was all bottled up in my notes and would never be public.

I have a few specific goals in mind to solve a couple different problems.

## Why?

Before we begin, imma be honest, it's a pretty convoluted setup. Overengineered some might say, and I agree. I could also pass the markdown through mkdocs and rsync the output to a nginx service somewhere. This works too, I've done that. Loved it. Now I'm trying something new because I can. Love how that works.

I like docker containers. I can usually just build it locally, throw it on some platform and point a domain at it.

I think text/markdown will last longer than Astro, [[quartz]] or any other generator so separating the content from the build is important.

## Goals

- I want to write more, easily
- I want to be able to paste images and have them in the final build
- I want to be able to see my notes on mobile with Obsidian's features that I use everyday
- I want the content to standalone from the build/site.
- I want to give back to the community that gave so much to me.

### Write more, easily

 It should be as simple as open, write, save, done. All within keystrokes, no clicks.
 
 With the Astro site, the content is buried deep in a place that's hard for me to access. I've tried symlinks, and copies, and submodules, but that's a bit too much for me. It always adds an extra command or two.

Embedding the site into my existing vault means I only have to move the file

If I'm in Obsidian, this might look like…

- `CTRL + SHIFT + P` to open the cmd palette
- `move file<Enter>`
- `Pub<Enter>` move the file where I need it to go

![[building-this-site-1.png|moving a file|512]]

![[building-this-site-2.png|moving to public folder|512]]

## Solutions

### Quartz

[[quartz]] is a static site generator that originally started to render obsidian vaults, but has seems to have expanded since I first saw it. It builds this very site with some minimal changes.

### Git

My main vault isn't even a [[git]] repo. I actually use it a lot more like a user's home directory. I've got a folder for Pictures/Videos, one for Documents, and on and on. I don't feel like managing git and branches and remotes and especially LFS. So I use some file syncing service like [[owncloud]]/[[nextcloud]] or [[syncthing]] instead. Currently, I'm using ~~[[owncloud]]~~ [[syncthing]]. Nice simple UI, easy to setup, restoring works and conflict resolution is easy. Package on every distro. Hasn't ever let me down in the last ~~year+~~ month. It's mostly just text files.

However, this site, within my vault, _is_ a git repo. ~~But only on my desktop and the `.git/` directory is ignored in~~. This lets me edit the file on any other computer and deploy from within obsidian.

- `CTRL + SHIFT + P` to open the cmd palette
- `sync<Enter>` add/commit with a default msg/push

> [!info] [Vinzent03/obsidian-git](https://github.com/Vinzent03/obsidian-git) plugin for the [[git]] integration

![[building-this-site-3.png|syncing the vault|512]]

Or even from another host (given that [[ssh-passwordless]] is setup and the directory/repository exists in a good state):

```bash
alias dotpublish="ssh desktop 'cd ~/path/to/Vault/Public && git pull && git add . && git commit -m remote-commit && git push'"

# Or...
dotpublish() {
  # SSH into the server and execute commands in the given directory
	# Oneliner
	# ssh "$1" "cd $2 && git pull origin $3 && git add . && git commit -m '$4' && git push origin $3" 
  ssh "$1" << EOF
    cd "$2" || exit
    git pull origin "$3" || exit
    git add . || exit
    git commit -m "$4" || exit
    git push origin "$3" || exit
EOF
}

dotpublish desktop "~/path/to/Vault/Public" main remote-commit
```

I don't actually use this, but you get the idea…

### CI

The content is in a standalone git repo so I'm much more willing to deal with git LFS and things. the `media/` folder could even be split out into it's own repo later on if needed.

Once the content is "published" we can build it. To me, this is where it's gets interesting.

I have an #tools/github-actions that runs to build the site. You can even view the [[Dockerfile]], which uses a pre-built [quartz](https://quartz.jzhao.xyz/) to build and publish the site to a registry.

Now I have a [docker](#docker) image that I can pull/publish to any registry.

![[building-this-site-8.png|the container|512]]

![[building-this-site-9.png|running the container|512]]

Easy, breezy, beautiful …

Then, with a fairly simple [fly.toml](/fly.toml) and running `flyctl deploy --local-only` to deploy.

### Docker

Once we have the docker image from the [ci](#ci) pipeline. I use [coolify](https://coolify.io) to deploy it locally on like a "staging" server. The `main` branch also get's published to fly.io.

Check out some other ways I've found a use for [[tags/tools/docker|docker]].
