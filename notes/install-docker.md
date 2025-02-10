---
draft: false
publish: true
aliases:
  - Install Docker
description: Guide for installing Docker on Ubuntu-based LXC containers
date: 2024-11-19
updated: 2025-02-09
tags:
  - tools/docker
  - snippets
  - tools/linux
up: 
jump: 
down: 
id: install-docker
---

## Install Docker

- Install LXC from template (ubuntu-server)
- Enable keyctl and nesting
  - Select CT >> Options >> Features >> Edit >> Enabled keyctl and nesting
- Update apt `apt update && apt upgrade`
  - Reboot
- Install [Docker](https://docs.docker.com/engine/install/ubuntu/)
  - Add [APT Repo](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
  - Install Docker packages
    - `sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`
  - [Docker post-install](https://docs.docker.com/engine/install/linux-postinstall/)
  - Test docker
    - `sudo docker run hello-world`
